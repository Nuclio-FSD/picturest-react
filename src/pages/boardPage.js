import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import PinsList from "../components/pinsList/PinsList";

export const BoardPage = () => {
  const params = useParams();
  const history = useHistory();
  console.log(params);
  const [board, setBoard] = useState({});

  useEffect(() => {
    fetch(`https://curso-test.herokuapp.com/boards/${params.id}`)
      .then((response) => response.json())
      .then((json) => setBoard(json))
      .catch(() => {
        history.push("/?notFound=true");
      });
  }, []);

  return (
    <div>
      <div>
        <p>{board.title}</p>
        <p>{board.author}</p>
      </div>
      <PinsList />
    </div>
  );
};

export default BoardPage;
