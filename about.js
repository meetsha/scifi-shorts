const contactEl = document.querySelector("#corrections-contact");

async function loadCorrectionsContact() {
  try {
    const response = await fetch("./data/site.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const config = await response.json();
    if (!config.correctionsEmail) return;

    const link = document.createElement("a");
    link.href = `mailto:${config.correctionsEmail}`;
    link.textContent = config.correctionsEmail;
    contactEl.replaceChildren(
      document.createTextNode("Report corrections by email: "),
      link,
      document.createTextNode("."),
    );
  } catch (error) {
    console.error("Unable to load site configuration:", error);
  }
}

loadCorrectionsContact();
