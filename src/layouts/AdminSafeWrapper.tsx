const AdminSafeWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="app-safe">
            {children}
        </div>
    );
};

export default AdminSafeWrapper;
