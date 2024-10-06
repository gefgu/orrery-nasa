import Header from "../../Components/Header";
function Rogue() {
  return (
    <>
      <Header></Header>
      <div
        style={{
          maxWidth: "768px",
          margin: "auto",
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <h1 style={{ marginBottom: 20, padding: 8 }}>
          Space Junk: A Global Challenge in Orbit
        </h1>
        <div style={{ padding: 8 }}>
          <h2>The Problem of Space Junk</h2>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            With the increasing advancement of space technologies, the space
            around the Earth has become increasingly congested. The accumulation
            of decommissioned satellites, rocket pieces and fragments resulting
            from collisions has created a vast amount of debris orbiting the
            planet, known as space junk. This debris poses serious risks to
            space missions, operating satellites and even the International
            Space Station. Collisions with these objects can generate even more
            fragments, worsening the problem in a chain reaction.
          </p>
        </div>
        <div style={{ padding: 8 }}>
          <h2>Awareness and Solutions</h2>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            Raising awareness about space debris is critical to ensuring the
            safe future of space exploration. Companies and governments around
            the world are working to develop effective solutions to monitor and
            mitigate the risks caused by this growing challenge. One of these
            innovative solutions is the continuous monitoring of the orbit of
            satellites, rocket debris and other fragments, using cutting-edge
            technologies that allow a clear, real-time view of objects in orbit.
          </p>
        </div>
        <div style={{ padding: 8 }}>
          <h2>Technology in Action: Rogue Space Systems</h2>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            Rogue Space Systems Corporation has developed an easy-to-use,
            interactive technology that tracks these space objects. Using the{" "}
            <a href="https://sky.rogue.space/?intldes=1963-039C">Sky</a>
            platform, it is possible to monitor the orbit of satellites, rocket
            stages and other debris with precision, allowing users to follow the
            movement of these bodies, as well as their names. This system offers
            a powerful and affordable solution to help raise awareness about
            space debris and develop mitigation strategies.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            Rogue Space Systems' innovation and commitment are paving the way
            for a safer future in space. Explore the platform and be part of
            this movement to preserve the space environment for generations to
            come.
          </p>
          <p>
            © 2020 - 2024 Rogue Space Systems Corporation, All rights reserved.
          </p>
        </div>
      </div>
      <iframe
        src="https://sky.rogue.space/"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="WebApp"
      />
    </>
  );
}
export default Rogue;
