import { useLoading } from "../context/LoadingContext";

const Loader = () => {
  const { loading, loadingText } = useLoading();

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p className="loader-text">{loadingText}</p>
    </div>
  );
};

export default Loader;
