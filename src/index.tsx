import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';

function SongViewer() {
  return <div class="rootcolumn">
    Blip
  </div>;
}

function App() {
  return <div>
      <h1>Rem8xer</h1>
      <div class="rootcontainer">
        <SongViewer />
        <SongViewer />
      </div>
  </div>;
}

render(<App/>, document.getElementById("rootcontainer"));
