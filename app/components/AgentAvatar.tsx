import Image from "next/image";

export const AGENT_AVATARS: Record<string, { src: string; color: string }> = {
  Mickey: { src: "/avatars/mickey.png", color: "#7c3aed" },
  Cody: { src: "/avatars/cody.png", color: "#10b981" },
  Josefina: { src: "/avatars/josefina.png", color: "#ec4899" },
  Rex: { src: "/avatars/rex.png", color: "#f97316" },
  Nova: { src: "/avatars/nova.png", color: "#3b82f6" },
  Dash: { src: "/avatars/dash.png", color: "#22c55e" },
};

interface AgentAvatarProps {
  name: string;
  size?: number;
  active?: boolean;
  className?: string;
}

export default function AgentAvatar({
  name,
  size = 48,
  active = false,
  className = "",
}: AgentAvatarProps) {
  const agent = AGENT_AVATARS[name];
  if (!agent) return null;

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `2px solid ${agent.color}60`,
        boxShadow: active ? `0 0 20px ${agent.color}40` : "none",
      }}
    >
      <Image
        src={agent.src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    </div>
  );
}
