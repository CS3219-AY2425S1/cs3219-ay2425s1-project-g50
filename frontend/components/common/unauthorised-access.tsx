import { Button } from "@/components/ui/button";

interface UnauthorisedAccessProps {
  isLoggedIn: boolean;
}

export default function UnauthorisedAccess({
  isLoggedIn,
}: UnauthorisedAccessProps) {
  return (
    <div className="flex items-start justify-center h-2/6">
      <div className="text-center mt-[20vh]">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Uh Oh! You&apos;re not supposed to be here!
        </h1>
        <Button
          size="lg"
          onClick={() => {
            isLoggedIn
              ? (window.location.href = "/") // TODO: Change redirect later based on user login
              : (window.location.href = "/");
          }}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
