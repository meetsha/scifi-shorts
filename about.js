const contactEl = document.querySelector("#corrections-contact");

async function loadCorrectionsContact() {
  try {
    const response = await fetch("./data/site.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const config = await response.json();
    if (!config.correctionsEmail) return;

    const link = document.createElement("a");
    link.href = `mailto:${config.correctionsEmail}`;
    link.textContent = "Report a correction";
    contactEl.replaceChildren(
      link,
      document.createTextNode("."),
    );
    contactEl.hidden = false;
  } catch (error) {
    console.error("Unable to load site configuration:", error);
  }
}

loadCorrectionsContact();
