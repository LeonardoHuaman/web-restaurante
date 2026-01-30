const WaiterSafeWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="app-safe bg-primary">
            {children}
        </div>
    );
};

export default WaiterSafeWrapper;
