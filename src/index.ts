import Snake, { opt } from "./game";

import "./styles/main.scss";

(function () {
  const game: Snake = new Snake(document.getElementById("game"), {
    width: 400,
    height: 400,
  });

  game.init((run: any) => {
    
    const { canvas }: Snake = game;

    if (!opt.isRunning) {
      canvas.style.background = `url("./img/snake-preview.png")`;
      canvas.style.backgroundSize = "cover";
      canvas.style.backgroundRepeat = "no-repeat";
      canvas.style.backgroundPosition = "center";
    }

    document.addEventListener("keypress", (event) => {
      if (event.keyCode == 32) {
        if (!opt.isRunning) {
          opt.isRunning = true;
          canvas.style.background = `url("")`;
          canvas.style.backgroundColor = `black`;
          game.run = run
          requestAnimationFrame(run);
        }
      }
    });
  });
})();
