export default function Contact() {
  return (
    <div className="container mt-5 mb-5" id="contact">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center text-primary mb-4">Contactez-nous</h2>
              <p className="text-secondary text-center">
                Pour toute question ou demande d'information, veuillez remplir le formulaire ci-dessous.
              </p>
              <form>
                <div className="mb-3">
                  <label htmlFor="nom" className="form-label">Nom complet</label>
                  <input type="text" className="form-control" id="nom" placeholder="Votre nom" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Adresse e-mail</label>
                  <input type="email" className="form-control" id="email" placeholder="votre@email.com" />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="4" placeholder="Votre message ici..."></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4">Envoyer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
