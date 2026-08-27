import { useNavigation } from "react-router";

export function NavigationLoader() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-transparent animate-pulse" />
        <div className="h-full w-32 bg-gray-900 animate-pulse" />
      </div>
    </div>
  );
}
