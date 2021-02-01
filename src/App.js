import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Dropdown } from 'react-bootstrap'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from 'react';
import { useFirestore } from './firebase/useFirestore';

function App() {
  const modules = useFirestore('/moduloose/Uw7nTXVOrY0nocrZDLWH/Modules');
  const collectionsList = useFirestore('moduloose/Uw7nTXVOrY0nocrZDLWH/Skills');
  
  const [collection, setCollection] = useState(null);
  
  const [viewer, setViewer] = useState("");
  const [editor, setEditor] = useState("");

  const handleChange = (e) => {
    if(e.target.id === "viewer"){
      setViewer(e.target.value);
    } else {
      setEditor(e.target.value);
    }
  }
  
  //RENDER USER PAGE
  return (
    <div id="app" className="App">
      <div id="content-container" className="row container-fluid">
        <div id="selector-wrapper" className="col-5">
          <h1>Moduloose</h1>
          { collectionsList &&
            <Dropdown>
              <Dropdown.Toggle variant="light">
                  {collection ? collection.name : "Select Collection"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {collectionsList.map(collection => {
                  return(
                    <Dropdown.Item id={collection.name} onClick={() => setCollection(collection)}>{collection.name}</Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          }
          { modules && collection &&
            collection.types.sort((a, b)=>{
              var x = a.typeName.toLowerCase();
              var y = b.typeName.toLowerCase();
              if (x < y) {return -1;}
              if (x > y) {return 1;}
              return 0;
            }).map(type => {
              return (
                <Dropdown id={type.typeName} className="selector-dropdown">
                  <Dropdown.Toggle variant="dark">
                  {type.typeName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {type.moduleIDs && type.moduleIDs.map(moduleID => {
                      let module = modules.find(module => module.id === moduleID); 
                      return(
                        <Dropdown.Item id={moduleID} onClick={() => setViewer(module.content)}>{module && module.title}</Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              )
            })
          }
        </div>
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