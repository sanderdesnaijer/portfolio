import { getTranslations } from "../utils/translations";

export const PageNotFound = async () => {
  const translations = await getTranslations();

  return (
    <div>
      <p>{translations["page-not-found"]}</p>
    </div>
  );
};
