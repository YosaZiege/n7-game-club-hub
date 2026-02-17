import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function ForgotPasswordDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <p className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer">
          Forgot your password?
        </p>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Password Recovery</AlertDialogTitle>
          <AlertDialogDescription>
            To recover your password, please contact this number:
            <br />
            <span className="font-semibold text-foreground">
              +212 6 09 39 88 30
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

