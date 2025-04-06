import React from "react";
import UploadForm from "../../components/UploadForm";
import CardContainer from "../../components/CardContainer";
import TitleSection from "../../components/TitleSection";

function UploadPage() {
  return (
    <CardContainer width="98%" height="95vh" margin="10px">
      <TitleSection
        title="Uploader votre propriété intellectuelle"
        text="Ajoutez votre propriété intellectuelle pour la sécuriser sur la blockchain et garantir son authenticité."
      />
        <hr style={{ marginBottom: "20px" }} />

 
      <UploadForm />
    </CardContainer>
  );
}

export default UploadPage;
