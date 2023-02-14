import { useState } from "react";
import { NavLink } from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { WebviewWindow } from "@tauri-apps/api/window";

function HistoryButton() {
  const [isOpeningHistory, setIsOpeningHistory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  function openHistory() {
    if (isOpeningHistory || isHistoryOpen) {
      return;
    }

    setIsOpeningHistory(true);
    const historyWebview = new WebviewWindow("history", {
      url: "/history.html",
      title: "🗓️ Sessions History",
      width: 320,
      height: 500,
      resizable: false,
    });

    historyWebview.once("tauri://created", function () {
      setIsOpeningHistory(false);
      setIsHistoryOpen(true);
    });

    historyWebview.once("tauri://error", function (e) {
      setIsOpeningHistory(false);
      console.log("error", e);
    });

    historyWebview.onCloseRequested(() => {
      setIsHistoryOpen(false);
    });
  }

  return (
    <NavLink
      label="Sessions History"
      icon={<IconHistory size={20} />}
      active
      variant={isHistoryOpen ? "light" : "subtle"}
      sx={{
        width: "168px",
        fontSize: "0.75rem",
        borderRadius: "0.5rem",
      }}
      onClick={openHistory}
    />
  );
}

export default HistoryButton;
