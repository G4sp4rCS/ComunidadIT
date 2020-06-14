setTime = () => {
  let now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString();
}

setTime();

setInterval(
  () => {
    setTime();
  },
1000);
