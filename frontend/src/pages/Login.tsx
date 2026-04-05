import Form from "../components/layout/Form";
import LanguageButton from "../components/ui/buttons/LanguageButton";
import ThemeButton from "../components/ui/buttons/ThemeButton";

function Login() {
  return (
    <div className="flex flex-col min-h-screen md:max-w-5xl w-full m-auto items-center justify-center">
      <h1 className="text-6xl font-bold mb-10">Quitter</h1>
      <div className="flex gap-10 mb-10">
        <LanguageButton />
        <ThemeButton />
      </div>
      <Form route="/api/token/" method="login" />
    </div>
  );
}

export default Login;
