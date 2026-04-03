import Form from "../components/layout/Form";

function Login() {
  return (
    <div className="flex flex-col min-h-screen md:max-w-5xl w-full m-auto items-center justify-center">
      <h1 className="text-6xl font-bold mb-20">Quitter</h1>
      <Form route="/api/token/" method="login" />
    </div>
  );
}

export default Login;
