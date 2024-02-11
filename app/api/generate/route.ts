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

    return new Response(
      JSON.stringify({ timestamp: new Date(), prompt, image }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

function connectWebSocketAndSendPrompt(prompt: string, retries = 0) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BASEURL);
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.msg) {
        case "send_hash":
          const sessionHash = Math.random().toString(36).substring(2);
          const sessionPayload = JSON.stringify({
            fn_index: 3,
            session_hash: sessionHash,
          });
          ws.send(sessionPayload);
          break;
        case "send_data":
          const promptPayload = JSON.stringify({
            fn_index: 3,
            data: [prompt + DEFAULT_PROMPT_EMBEDDING, "", 7.5, "Photographic"],
          });
          ws.send(promptPayload);
          break;
        case "process_completed":
          const image = processCompletion(data);
          console.log(image);
          resolve(image);
          break;
        case "queue_full":
          ws.close();
          if (retries < MAX_RETRIES * 10)
            setTimeout(() => {
              console.log("Retrying..." + retries);
              connectWebSocketAndSendPrompt(prompt, retries + 1);
            }, RETRY_TIMEOUT);
          else
            reject("Maximum retry attempts reached. Please try again later.");
          break;
      }
      ws.onerror = (error) => {
        reject(error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    };
  });
}

const processCompletion = (data: SocketMessage) => {
  if (
    data.output &&
    data.output.data &&
    data.output.data[0] &&
    data.output.data[0][0]
  )
    return data.output.data[0][0];
  else return null;
};
