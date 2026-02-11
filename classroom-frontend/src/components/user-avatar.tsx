import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetIdentity } from "@refinedev/core";

// Define what props the component can take
interface UserAvatarProps {
  src?: string | null;
}

export const UserAvatar = ({ src }: UserAvatarProps) => {
  // We still call this for the fallback name
  const { data: user } = useGetIdentity<{ name: string; avatar?: string }>();

  const getInitials = (name = "") => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <Avatar className="h-9 w-9 border border-border">
      {/* Priority: 1. Passed 'src' prop, 2. Identity avatar, 3. Fallback */}
      <AvatarImage src={src || user?.avatar} alt={user?.name} />
      <AvatarFallback>
        {getInitials(user?.name || "U")}
      </AvatarFallback>
    </Avatar>
  );
};