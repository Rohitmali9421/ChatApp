import { useEffect } from "react";
import { fetchMessages } from "../Services/api";

const useFetchMessage = ({ id, setMessages }) => {
  useEffect(() => {
    if (id) {
      fetchMessages(id, setMessages);
    }
  }, [id, setMessages]);
};

export default useFetchMessage;
