import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [show, setshow] = useState(false);
  const [noteTitle, setnoteTitle] = useState("");
  const [notecont, setnotecont] = useState("");
  const [titlenotes, settitlenotes] = useState([]);
  const [contnotes, setcontnotes] = useState([]);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const notesRef = useRef([]);

  const seva = () => {
    if (noteTitle.trim() === "" || notecont.trim() === "") {
      setshow(false);
      return;
    }
    settitlenotes([...titlenotes, noteTitle]);
    setcontnotes([...contnotes, notecont]);
    setshow(false);
    setnoteTitle("");
    setnotecont("");
  };

  const toggleVisibility = (index) => {
    if (visibleIndexes.includes(index)) {
      setVisibleIndexes(visibleIndexes.filter((i) => i !== index));
    } else {
      setVisibleIndexes([...visibleIndexes, index]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // تحقق إذا كان الضغط تم خارج كل عناصر الملاحظات
      const clickedOutsideAll = notesRef.current.every(
        (note) => note && !note.contains(e.target)
      );
  
      if (clickedOutsideAll) {
        setVisibleIndexes([]);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const savedtitle = JSON.parse(localStorage.getItem('titlenotes'));
    if (savedtitle) {
      settitlenotes(savedtitle);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('titlenotes', JSON.stringify(titlenotes));
  }, [titlenotes]);

  useEffect(() => {
    const savedcont = JSON.parse(localStorage.getItem('contnotes'));
    if (savedcont) {
      setcontnotes(savedcont);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('contnotes', JSON.stringify(contnotes));
  }, [contnotes]);
  const handleDeleteTask = (indexToDelete) => {
    const newtasks = titlenotes.filter((_, index) => index !== indexToDelete);
    settitlenotes(newtasks);
  };

  return (
    <div>
      <h1>What happened today?</h1>

      <div className="add-btn-div">
        <button onClick={() => setshow(true)} className="add-btn">
          add a note
        </button>
      </div>

      {show && (
        <>
          <div className="add-box-div">
            <input
              value={noteTitle}
              onChange={(e) => setnoteTitle(e.target.value)}
              type="text"
              placeholder="ادخل عنوان الملاحظه"
              className="note-name"
            />
          </div>
          <div className="add-box-div">
            <textarea
              value={notecont}
              onChange={(e) => setnotecont(e.target.value)}
              placeholder="ادخل نص الملاحظه"
              className="note-contenar"
            />
          </div>
          <div className="add-note-div">
            <button onClick={seva} className="add-note-2">
              add
            </button>
          </div>
        </>
      )}

      <ul>
        {titlenotes.map((t, index) => (
          <li key={index} ref={(el) => (notesRef.current[index] = el)}>
            <div className="note-wrapper">
              <div className="note-div-t" onClick={() => toggleVisibility(index)}>
                <h3 className="title-note">
                  {t}
                  <img
                    className="imgr"
                    src={ visibleIndexes.includes(index) ? "/icons/close.svg" : "/icons/show.svg"}
                    width={24}
                    height={24}
                    alt="icon"
                  />
                  <button onClick={() => handleDeleteTask(index)} className="img"><img width={24}
                    height={24} src="/icons/delete.svg"/></button>
                </h3>
              </div>
              <div className={`note-div-c ${visibleIndexes.includes(index) ? "show" : ""}`}>
                <p className="cont">{contnotes[index]}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}