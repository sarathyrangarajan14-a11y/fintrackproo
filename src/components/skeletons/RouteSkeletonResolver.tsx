import { useLocation } from "react-router-dom";
import DashboardSkeleton from "./DashboardSkeleton";
import ExploreSkeleton from "./ExploreSkeleton";
import SchemeDetailSkeleton from "./SchemeDetailSkeleton";
import PartnerDashboardSkeleton from "./PartnerDashboardSkeleton";
import GeneralPageSkeleton from "./GeneralPageSkeleton";

export default function RouteSkeletonResolver() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (path.startsWith("/explore")) {
    return <ExploreSkeleton />;
  }

  if (path.startsWith("/dashboard")) {
    return <DashboardSkeleton />;
  }

  if (path.startsWith("/funds")) {
    return <SchemeDetailSkeleton />;
  }

  if (path.startsWith("/partner")) {
    return <PartnerDashboardSkeleton />;
  }

  if (path.startsWith("/goals") || path.startsWith("/kyc") || path.startsWith("/profile-setup")) {
    return <GeneralPageSkeleton titleWidth="w-56" />;
  }

  if (path.startsWith("/calculators")) {
    return <GeneralPageSkeleton titleWidth="w-72" />;
  }

  return <GeneralPageSkeleton titleWidth="w-64" />;
}
