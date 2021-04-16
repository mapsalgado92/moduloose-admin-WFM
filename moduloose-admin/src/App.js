import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Dropdown } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { useFirestore } from './firebase/useFirestore';
import { uploadFirestore, deleteFirestore } from './firebase/firestoreFunctions';
import { CopyToClipboard } from 'react-copy-to-clipboard';

//ADMIN PAGE
function App() {
  const modules = useFirestore('moduloose/moduloose-WFM/modules'); //Array of all modules
  const groups = useFirestore('moduloose/moduloose-WFM/groups'); //Array of all groups

  const [group, setGroup] = useState(null);
  const [modulesGroup, setModulesGroup] = useState(null);

  //MODULE FORM
  const [formType, setFormType] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  useEffect(() => {
    group && setGroup(groups.find((gr) => gr.name === group.name));
    group && setModulesGroup(modules.filter((module) => module.group === group.name))
  }, [groups, group, modules]);

  const handleChangeType = (e) => {
    setFormType(e.target.value);
  }

  const handleChangeTitle = (e) => {
    setFormTitle(e.target.value);
  }

  const handleChangeContent = (e) => {
    setFormContent(e.target.value);
  }

  const handleSelectGroup = (group) => {
    setGroup(group);
    setModulesGroup(modules.filter((module) => module.group === group.name));
  }

  const handleSelectModule = (module) => {
    setFormType(module.type)
    setFormTitle(module.title)
    setFormContent(module.content)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType && formTitle && formContent !== "delete" && formContent !== "change") {
      //ADDING OR UPDATING
      let moduleExists = modulesGroup.filter(module => module.type === formType).find(module => module.title === formTitle);
      if (moduleExists) {
        ///UPDATING MODULE
        console.log("Updating Module")
        uploadFirestore('moduloose/moduloose-WFM/modules', { group: group.name, type: formType, title: formTitle, content: formContent, id: moduleExists.id });
      } else {
        ///ADDING MODULE
        console.log("Creating Module")
        let newID = group.name + formType + formTitle;
        newID = newID.split(" ").join("_");
        uploadFirestore('moduloose/moduloose-WFM/modules', { group: group.name, type: formType, title: formTitle, content: formContent, id: newID });
        ////MANAGE TYPE
        let typeExists = group.types.find((type) => type === formType);
        if (typeExists) {
          console.log("--Type already exists");
        }
        ////TYPE DOES NOT EXIST
        else {
          console.log("--Creating Type")
          let newTypes = [...group.types].concat([formType]);
          uploadFirestore('moduloose/moduloose-WFM/groups', { ...group, types: newTypes });
        }
      }
    }
    else if (formType && formTitle && formContent === ("delete" || "")) {
      //DELETING MODULE
      let moduleExists = modulesGroup.find((module) => module.title === formTitle && module.type === formType);
      if (moduleExists) {
        console.log("Deleting Module")
        deleteFirestore('moduloose/moduloose-WFM/modules', moduleExists.id);
        ////MANAGE TYPE
        let typesLeft = modulesGroup.filter((module) => module.type === formType).length
        if (typesLeft <= 1) {
          console.log("--Deleting Type from Group")
          let newTypes = [...group.types].filter(type => type !== formType);
          uploadFirestore('moduloose/moduloose-WFM/groups', { ...group, types: newTypes });
        } else {
          console.log("--Type was preserved")
        }
      }
      else {
        ///MODULE DOES NOT EXIST
        console.log("Module does not exist");
      }
    } else if (formType && formTitle && formContent === "change") {
      //CHANGE TYPE NAME
      let newName = formTitle;
      if (group.types.find(type => type === formType)) {
        //CHANGE TYPE IN MODULES
        let modulesToChange = modulesGroup.filter(module => module.type === formType);
        modulesToChange.forEach(module => {
          console.log("Changing type in Module")
          uploadFirestore('moduloose/moduloose-WFM/modules', { ...module, type: newName });
        });
        ///CHANGE TYPE IN GROUP
        let newTypes = [...group.types].filter(type => type !== formType).concat([newName]);
        console.log("New Types: " + newTypes);
        uploadFirestore('moduloose/moduloose-WFM/groups', { ...group, types: newTypes });
        console.log("Changing Type in Group");
      }
    } else {
      console.log("No valid option");
    }
    setFormType("");
    setFormTitle("");
    setFormContent("");
  }

  //RENDER ADMIN PAGE
  return (
    <div id="app" className="admin">
      <div id="content-container">
        <div id="selector-wrapper">
          <div className="title-div">
            <h1>Moduloose Admin</h1>
          </div>
          {groups &&
            <Dropdown>
              <Dropdown.Toggle variant="light" id="main-dropdown">
                {group ? group.name : "Select Group"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {groups.sort((a, b) => {
                  var x = a.name.toLowerCase();
                  var y = b.name.toLowerCase();
                  if (x < y) { return -1; }
                  if (x > y) { return 1; }
                  return 0;
                }).map(group => {
                  return (
                    <Dropdown.Item id={group.name} onClick={() => handleSelectGroup(group)}>{group.name}</Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          }
          {/*VIEW MODULES*/ modules && group &&
            group.types.sort().map(type => {
              return (
                <Dropdown id={type} className="selector-dropdown">
                  <Dropdown.Toggle variant="dark">{type}</Dropdown.Toggle>
                  <CopyToClipboard id={type + "-copy"} text={type}><button className="btn btn-light edit-button ml-2">Copy</button></CopyToClipboard>
                  <Dropdown.Menu>
                    {modulesGroup && modulesGroup.filter((module) => module.type === type).map(module => {
                      return (
                        <>
                          <Dropdown.Item onClick={() => handleSelectModule(module)}>{module.title}</Dropdown.Item>
                        </>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              )
            })
          }
          {/*EDIT MODULE FORM*/modules && group &&
            <form className="form-container">
              <h3>Add-Update-Remove Module</h3>
              <label>Type</label>
              <input id="type-input" type="text" value={formType} onChange={handleChangeType}></input>
              <label>Title</label>
              <input id="title-input" type="text" value={formTitle} onChange={handleChangeTitle}></input>
              <label>Content</label>
              <textarea id="content-input" type="text" value={formContent} onChange={handleChangeContent}></textarea>
              <button className="btn btn-dark edit-button" onClick={handleSubmit}>Submit</button>
            </form>
          }
        </div>
      </div>
    </div>
  );

}

export default App;