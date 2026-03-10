export default function About() {
  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold mt-8">O nas</h1>
      <div className="flex flex-col mt-8">
        <div>
          <p className="font-medium text-lg">OBALNI ALPINISTIČNI KLUB</p>
          <p>Zg. Škofije 14</p>
          <p>6281 Škofije</p>
        </div>
        <div className="mt-7">
          <p className="font-medium text-lg">Upravni odbor:</p>
          <ul>
            <li>Gregor Bratož– načelnik</li>
            <li>Sonja Živec – namestnica načelnika</li>
            <li>Fulvij Živec – gospodar</li>
            <li>Peter Kokotec</li>
            <li>Simon Glavina</li>
            <li>Marjan Olenik</li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-7 md:gap-10 mt-7">
          <div>
            <p className="font-medium text-lg">Vodja zbora alpinistov</p>
            <ul>
              <li>Mojca Cencič</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-lg">Nadzorni dobor:</p>
            <ul>
              <li>Jaka Petruša</li>
              <li>Andrej Knez</li>
              <li>Urban Hrvatin</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-lg">Disciplinska komisija:</p>
            <ul>
              <li>Borut Antončič</li>
              <li>Klavdij Bembič</li>
              <li>Andreja Kuzmič</li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <span><p className="font-medium">Kontakt:</p> info@obalniak.si</span>
        </div>
      </div>
    </div>
  )
}
