type SessionIdentity = {
  sub: string;
  tokenVersion: number;
};

type AdminIdentity = {
  id: string;
  tokenVersion: number;
};

export function sessionMatchesAdmin(
  session: SessionIdentity,
  admin: AdminIdentity | null,
): admin is AdminIdentity {
  return (
    admin !== null &&
    admin.id === session.sub &&
    admin.tokenVersion === session.tokenVersion
  );
}
