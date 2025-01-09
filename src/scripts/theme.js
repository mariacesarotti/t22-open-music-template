export const darkMode = () => {
    const headerBtn = document.querySelector(".header__btn");
    if (!headerBtn) {
      console.error("Elemento .header__btn não encontrado!");
      return; 
    }
    headerBtn.addEventListener("click", () => {
      const html = document.documentElement;
      console.log("HTML element:", html);
      console.log("Before toggle:", html.classList);
      const isDarkMode = html.classList.toggle("dark-mode");
      headerBtn.classList.toggle("header__btn--dark-mode");
      console.log("After toggle:", html.classList);
      localStorage.setItem("@dark-mode", JSON.stringify(isDarkMode));
      console.log("Local storage value set:", localStorage.getItem("@dark-mode"));
      });
  };
  
  export const verifyMode = () => {
    const isDarkMode = JSON.parse(localStorage.getItem("@dark-mode"));
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document
        .querySelector(".header__btn")
        .classList.add("header__btn--dark-mode");
        console.log("debug2");
    }else{
      console.log("debug3");
    }
    console.log("Verifying mode...");
  
  };
  