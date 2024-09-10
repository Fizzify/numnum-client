const HealthBar = ({ health }: { health: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 bg-red-500 w-44">
        <div
          className="h-full bg-green-500 transition-[width] ease-in-out"
          style={{ width: `${health}%` }}
        ></div>
      </div>
      <span className="font-sans">{health} HP</span>
    </div>
  );
};

export default HealthBar;
