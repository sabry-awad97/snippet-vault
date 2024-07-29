interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      {text}
    </h2>
  );
};

export default Title;
