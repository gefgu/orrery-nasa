import Header from "../../Components/Header";
function Project() {
  return (
    <>
      <Header></Header>
      <iframe
        src="./webapp.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="WebApp"
      />
    </>
  );
}
export default Project;
