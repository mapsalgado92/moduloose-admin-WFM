import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Dropdown } from 'react-bootstrap'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from 'react';
import { useFirestore } from './firebase/useFirestore';

function App() {
  const modules = useFirestore('moduloose/moduloose-main/modules'); //Array of all modules
  const groups = useFirestore('moduloose/moduloose-main/groups'); //Array of all groups
  
  const [group, setGroup] = useState(null);
  const [modulesGroup, setModulesGroup] = useState(null);

  const [viewer, setViewer] = useState("");
  const [editor, setEditor] = useState("");

  const handleChange = (e) => {
    if(e.target.id === "viewer"){
      setViewer(e.target.value);
    } else {
      setEditor(e.target.value);
    }
  }

  const handleSelectGroup = (group) => {
    setGroup(group);
    setModulesGroup(modules.filter((module) => module.group === group.name));
  }
  
  //RENDER USER PAGE
  return (
    <div id="app" className="App" style={{background: `url('${process.env.PUBLIC_URL}/images/background-light-grey.png')`}}>
      <div id="content-container" className="row container-fluid">
        <div id="selector-wrapper" className="col-5">
          <div className="title-div">
            <h1>Moduloose</h1>
          </div>
          {/*RENDER GROUP DROPDOWN*/}
          { groups &&
            <Dropdown>
              <Dropdown.Toggle variant="light" id="main-dropdown">
                  {group ? group.name : "Select Group"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {groups.sort((a, b)=>{
              var x = a.name.toLowerCase();
              var y = b.name.toLowerCase();
              if (x < y) {return -1;}
              if (x > y) {return 1;}
              return 0;
            }).map(group => {
                  return(
                    <Dropdown.Item id={group.name} onClick={() => handleSelectGroup(group)}>{group.name}</Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          }
          {/*RENDER TYPE DROPDOWNS*/}
          { modulesGroup && group &&
            group.types.sort().map((type) => {
              return (
                <Dropdown id={type} className="selector-dropdown">
                  <Dropdown.Toggle variant="dark">{type}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {modulesGroup && modulesGroup.filter((module)=>module.type === type).map(module => {
                      return(
                        <Dropdown.Item id={module.id} onClick={() => setViewer(module.content)}>{module.title}</Dropdown.Item>
                      )})}
                  </Dropdown.Menu>
                </Dropdown>
              )
            })}
        </div>
        {/*RENDER WORKSPACE*/}
        <div id="workspace-wrapper" className="col-7">
          <textarea id="viewer" value={viewer} onChange={handleChange} placeholder="Viewer"></textarea>
          <CopyToClipboard id="copy-viewer" className="btn btn-dark copy-button" text={viewer}><button>Copy Viewer</button></CopyToClipboard>
          <textarea id="editor" value={editor} onChange={handleChange} placeholder="Editor"></textarea>
          <CopyToClipboard id="copy-editor" className="btn btn-dark copy-button" text={editor}><button>Copy Editor</button></CopyToClipboard>
        </div>
      </div>
    </div>
  );
  
}

export default App;