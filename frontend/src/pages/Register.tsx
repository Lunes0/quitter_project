import Form from "../components/layout/Form";

function Register() {
  return (
    <div className="flex flex-col min-h-screen md:max-w-5xl w-full m-auto items-center justify-center">
      <h1 className="text-6xl font-bold mb-20">Quitter</h1>
      <Form route="/api/user/register/" method="register" />
    </div>
  );
}

export default Register;
