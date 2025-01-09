export const fetchAlbums = async () => {
    try {
      const response = await fetch("https://openmusic-fake-api.onrender.com/api/musics");
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const albums = await response.json();
      console.log("Dados da API recebidos:", albums); // Debug para verificar os dados recebidos
      return albums;
    } catch (error) {
      console.error("Erro ao buscar álbuns:", error);
      return [];
    }
  };