import { UserStatus } from "@/src/components/user-status/user-status";

interface IProps {
  isActive: boolean;
}

export function SpaceTableStatus({ isActive }: IProps) {
  return (
    <UserStatus
      value={isActive ? "active" : "inactive"}
      options={[
        { name: "Ativa", value: "active" },
        { name: "Inativa", value: "inactive" },
      ]}
    />
  );
}
