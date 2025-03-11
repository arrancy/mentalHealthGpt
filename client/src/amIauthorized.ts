export async function amIAuthorized() {
  try {
    const response = await fetch("https://api.helpmymind.tech/me", {
      credentials: "include",
      headers: { "authorization": "Bearer " + localStorage.getItem("jwt") },
    });
    if (!response.ok) {
      console.log("response not ok");
      return false;
    } else {
      return true;
    }
  } catch (error) {
    if (error instanceof Error) {
      return false;
    } else {
      return false;
    }
  }
}
