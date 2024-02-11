import { CircularProgress, Chip } from "@nextui-org/react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
  message: string;
}

export function Progress({ progress, message, ...props }: ProgressProps) {
  return (
    <div {...props}>
      <CircularProgress
        classNames={{
          svg: "w-36 h-36 drop-shadow-md",
          indicator: "stroke-primary",
          track: "stroke-secondary",
          value: "text-3xl font-semibold text-primary",
        }}
        value={progress}
        strokeWidth={4}
        showValueLabel={true}
        aria-label="Generating Images..."
      />
      <Chip
        classNames={{
          base: "border-1 border-white/30",
          content:
            "text-secondary-foreground text-small font-semibold my-3 border-border",
        }}
        variant="bordered"
      >
        {message}
      </Chip>
    </div>
  );
}
