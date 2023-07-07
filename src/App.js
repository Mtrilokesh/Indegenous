import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "grey",
    minHeight: "100vh",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  head: {
    textAlign: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "black",
  },
  heading: {
    color: "white",
  },
  menu: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
  },
  menuItem: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  notesContent: {
    width: "100%",
    marginTop: theme.spacing(2),
    color: "white",
  },
  paragraph: {
    marginBottom: theme.spacing(2),
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    color: "white",
  },
}));

const App = () => {
  const classes = useStyles();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          "https://api.gyanibooks.com/library/get_dummy_notes"
        );
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotes();
  }, []);

  const renderFormattedNotes = () => {
    return (
      <div>
        <div className={classes.head}>
          <Typography variant="h4" className={classes.heading}>
            INDEGENOUS TASK
          </Typography>
        </div>
        {notes.map((note) => {
          const { id, user, title, category, notes: noteContent } = note;

          let parsedNotes = null;
          try {
            parsedNotes = JSON.parse(noteContent);
          } catch (error) {
            console.error("Error parsing note content:", error);
          }

          const getTextContent = (content) => {
            if (Array.isArray(content)) {
              return content
                .map((item) => {
                  if (item.type === "text") {
                    return item.text;
                  } else if (item.content) {
                    return getTextContent(item.content);
                  }
                  return null;
                })
                .join(" ");
            }
            return "";
          };

          const divStyle = {
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            padding: "2px",
            marginTop: "2px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "red",
            backgroundColor: "black",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
            paddingBottom: "8px",
          };

          const idStyle = {
            position: "absolute",
            top: "-8px",
            right: "-5px",
            backgroundColor: "black",
            color: "white",
            padding: "5px",
            borderRadius: "100%",
            fontSize: "16px",
            height: "40px",
            width: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };

          return (
            <div key={id} style={divStyle}>
              <div style={idStyle}>id.{id}</div>
              <div className={classes.menu}>
                <div className={classes.header}>
                  <Typography variant="h3" className={classes.title}>
                    {title.toUpperCase()}
                  </Typography>
                </div>

                <div className={classes.menuItem}>
                  <Typography variant="body1">User: {user}</Typography>
                </div>
                <div className={classes.menuItem}>
                  <Typography variant="body1">Category: {category}</Typography>
                </div>
              </div>
              <div className={classes.content}>
                <div className={classes.notesContent}>
                  {parsedNotes &&
                    parsedNotes.content &&
                    getTextContent(parsedNotes.content)
                      .trim()
                      .split("\n")
                      .map((text, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          className={classes.paragraph}
                        >
                          {text}
                        </Typography>
                      ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      {renderFormattedNotes()}
    </Container>
  );
};

export default App;
