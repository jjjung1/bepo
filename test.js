document.addEventListener("DOMContentLoaded", (event) => {
  const trashElements = document.querySelectorAll("#trash-area .trash");
  let totalTrashCount = trashElements.length;
  let currentComment = null;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  trashElements.forEach((element) => {
    element.addEventListener("dragstart", (event) => {
      if (currentComment) {
        currentComment.remove();
        currentComment = null;
      }

      const id = event.target.dataset["trash"];
      const posX = event.offsetX;
      const posY = event.offsetY;
      event.dataTransfer.setData("text/plain", `${id},${posX},${posY}`);
    });

    element.addEventListener("drag", (event) => {
      const trashElements = document.querySelectorAll(
        "#bin-area .bin-trash-area"
      );
      trashElements.forEach((binTrashArea) => {
        const rect = binTrashArea.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          if (!binTrashArea.classList.contains("active")) {
            binTrashArea.classList.add("active");

            const originalImage = binTrashArea.style.backgroundImage;
            binTrashArea.style.backgroundImage = originalImage.replace(
              "_stand",
              ""
            );
            setTimeout(() => {
              binTrashArea.style.backgroundImage = originalImage;
            }, 200);
          }
        } else {
          binTrashArea.classList.remove("active");
        }
      });
    });

    element.addEventListener("mouseover", (event) => {
      tooltip.style.display = "block";
      tooltip.textContent = event.target.dataset.info;
    });

    element.addEventListener("mousemove", (event) => {
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    });

    element.addEventListener("mouseout", (event) => {
      tooltip.style.display = "none";
    });
  });

  document
    .querySelectorAll("#bin-area .bin-trash-area")
    .forEach((binTrashArea) => {
      binTrashArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });

      binTrashArea.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("drop", event);
        console.log(`Dropped into: ${binTrashArea.id}`);

        const binArea = document.querySelector("#bin-area");
        const [id, posX, posY] = event.dataTransfer
          .getData("text/plain")
          .split(",");
        const relativeX =
          event.pageX -
          binArea.offsetLeft -
          parseInt(posX) -
          binTrashArea.offsetLeft;
        const relativeY =
          event.pageY -
          binArea.offsetTop -
          parseInt(posY) -
          binTrashArea.offsetTop;

        const trashElement = document.querySelector(
          `#trash-area .trash[data-trash="${id}"]`
        );

        const correctBinMap = {
          value1: "bin-trash-area3",
          value2: "bin-trash-area3",
          value3: "bin-trash-area2",
          value4: "bin-trash-area1",
        };

        if (trashElement && binTrashArea.id === correctBinMap[id]) {
          const clonedTrashElement = trashElement.cloneNode();
          clonedTrashElement.style.left = `${relativeX}px`;
          clonedTrashElement.style.top = `${relativeY}px`;
          binTrashArea.appendChild(clonedTrashElement);
          trashElement.style.display = "none";
          console.log(clonedTrashElement);

          const commentMap = {
            value1:
              ">> 자칫 병류로 오인할 수 있으나, 깨진 유리는 일반쓰레기로 배출하는 것이 옳습니다.",
            value2:
              ">> 된장, 고추장 등의 장류는 염도가 높아 가축의 사료로 부적합하므로 일반쓰레기로 배출합니다.",
            value3:
              ">> 정확히는 폐건전지함에 버려야 합니다. 다만 여의치 않다면, 재활용 쓰레기로 배출하여 선별작업 시 분리될 수 있도록 합니다. 일반쓰레기로 배출하지 않도록 주의합니다.",
            value4:
              ">> 대부분의 단단한 껍데기는 일반쓰레기 분류 대상이지만, 수박은 잘게 부수어 음식물 쓰레기로 배출합니다.",
          };

          const comment = document.createElement("div");
          comment.textContent = commentMap[id];
          comment.style.position = "absolute";
          comment.style.top = "73vh";
          comment.style.width = "75vh";
          comment.style.fontSize = "2.5vh";
          comment.style.color = "black";
          comment.style.fontWeight = "bold";
          comment.style.fontFamily = "Arial, sans-serif";
          document.body.appendChild(comment);

          currentComment = comment;

          setTimeout(() => {
            clonedTrashElement.classList.add("fade-out");
            clonedTrashElement.addEventListener("animationend", () => {
              clonedTrashElement.remove();
              totalTrashCount--;
              checkEmpty(totalTrashCount);
            });
          }, 200);
        } else if (trashElement) {
          binTrashArea.classList.add("shake");
          setTimeout(() => {
            binTrashArea.classList.remove("shake");
          }, 500);
        } else {
          console.error(`data-trash="${id}"가 존재하지 않음`);
        }

        binTrashArea.classList.remove("active");
      });
    });

  function checkEmpty(trashCount) {
    if (trashCount === 0) {
      const message = document.createElement("div");
      message.textContent = "완벽해요!";
      message.style.position = "absolute";
      message.style.top = "60vh";
      message.style.fontSize = "3vh";
      message.style.color = "black";
      message.style.fontWeight = "bold";
      message.style.fontFamily = "Arial, sans-serif";
      document.body.appendChild(message);

      setTimeout(() => {
        message.classList.add("fade-out");
        message.addEventListener("animationend", () => {
          message.remove();
          const newMessage = document.createElement("a");
          newMessage.textContent = "이제, 더 많은 분리배출을 해볼까요?";
          newMessage.href = "https://example.com";
          newMessage.style.position = "absolute";
          newMessage.style.top = "60vh";
          newMessage.style.fontSize = "3vh";
          newMessage.style.color = "black";
          newMessage.style.fontWeight = "bold";
          newMessage.style.fontFamily = "Arial, sans-serif";
          document.body.appendChild(newMessage);
        });
      }, 500);
    }
  }
});
