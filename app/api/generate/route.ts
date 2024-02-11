import {
  BASEURL,
  DEFAULT_PROMPT_EMBEDDING,
  MAX_RETRIES,
  RETRY_TIMEOUT,
} from "@/config/generation";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      !isValidToken(authHeader.split(" ")[1])
    ) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { prompt } = await req.json().catch(() => {
      throw new Error(
        'Could not parse JSON body. Please provide a valid JSON body. Example Body: { "prompt": "An elegant bedroom" }'
      );
    });
    if (!prompt) {
      return new Response(
        JSON.stringify({
          error:
            'No prompt provided. Example Body: { "prompt": "An elegant bedroom" }',
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const image = await connectWebSocketAndSendPrompt(prompt);
    console.log("Image generated server side");

    return new Response(image as string, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

function isValidToken(token: string) {
  return token === process.env.API_VALIDATION_TOKEN;
}

function connectWebSocketAndSendPrompt(
  prompt: string,
  retries: number = 0
): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BASEURL);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      // Send session hash immediately after opening the connection
      const sessionHash = Math.random().toString(36).substring(2);
      const sessionPayload = JSON.stringify({
        fn_index: 3,
        session_hash: sessionHash,
      });
      ws.send(sessionPayload);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.msg) {
        case "send_data":
          const promptPayload = JSON.stringify({
            fn_index: 3,
            data: [prompt + DEFAULT_PROMPT_EMBEDDING, "", 7.5, "Photographic"],
          });
          ws.send(promptPayload);
          break;
        case "process_completed":
          const image = processCompletion(data);
          console.log("Image generated");
          ws.close();
          resolve(image as string);
          break;
        case "queue_full":
          ws.close();
          if (retries < MAX_RETRIES) {
            console.log(`Retrying... ${retries}`);
            setTimeout(() => {
              connectWebSocketAndSendPrompt(prompt, retries + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_TIMEOUT);
          } else {
            console.log(
              "Maximum retry attempts reached. Please try again later."
            );
            reject(new Error("Maximum retry attempts reached."));
          }
          break;
        default:
          console.log("Unhandled message type:", data.msg);
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
      reject(error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  });
}

const processCompletion = (data: SocketMessage) => {
  if (
    data.output &&
    data.output.data &&
    data.output.data[0] &&
    data.output.data[0][0]
  ) {
    return data.output.data[0][0]; // Assuming this is the base64 image string
  } else {
    return null;
  }
};
