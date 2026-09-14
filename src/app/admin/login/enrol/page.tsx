import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { AuthCard } from "@/components/admin/AuthCard";
import { CodeForm } from "@/components/admin/CodeForm";
import { EnrolSecret } from "@/components/admin/EnrolSecret";
import { beginEnrolment } from "@/app/admin/auth-actions";
import { readPending } from "@/lib/auth";
import { otpauthUri } from "@/lib/totp";

export const metadata = { title: "Set up two step", robots: { index: false, follow: false } };

export default async function EnrolPage() {
  const email = await readPending();
  if (!email) redirect("/admin/login");

  const secret = await beginEnrolment(email);
  const uri = otpauthUri(secret, email);
  // Rendered on the server so the secret never travels as a separate request.
  const qr = await QRCode.toString(uri, { type: "svg", margin: 0, width: 200 });

  return (
    <AuthCard
      eyebrow="One more step"
      title="Set up two step"
      lead="Add Uphold to Google Authenticator, Authy or 1Password, then enter the six digit code it shows. Without this, a stolen password is enough on its own."
    >
      <div className="flex flex-col items-center gap-5 rounded-input border border-line bg-surface-2 p-6">
        <p className="text-center text-[14px] leading-[1.5] text-ink-70">
          <strong className="text-ink">On another device</strong>, scan this with your
          authenticator app.
        </p>

        <div
          aria-hidden="true"
          className="h-[200px] w-[200px] rounded-[8px] bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qr }}
        />

        {/*
          A QR cannot be scanned by the screen displaying it. On a phone this
          link hands the account straight to the authenticator app; on a desktop
          it works only if something is registered for otpauth:, which is why
          the key below is always shown as well.
        */}
        <a
          href={uri}
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-ink/85"
        >
          On this phone, open my authenticator
        </a>
        <p className="-mt-2 max-w-[38ch] text-center text-[13px] leading-[1.5] text-ink-45">
          On an iPhone this usually opens the Passwords app, which works. If your
          password for this account lives there too, both factors sit behind one
          unlock: use a separate authenticator app to keep them apart.
        </p>

        <div className="w-full border-t border-line pt-5">
          <EnrolSecret secret={secret} />
        </div>
      </div>

      <div className="mt-7">
        <CodeForm mode="enrol" />
      </div>
    </AuthCard>
  );
}
