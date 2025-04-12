import { useLocation, useSearchParams } from "react-router";
import { CourtList, Footer, Navigation, Search } from "../ui";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useMemo } from "react";

export default function FieldsPage() {
  const [searchParams] = useSearchParams();

  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const urlSearchParams = useMemo(() => {
    let params = "";

    if (searchParams.get("fieldName")) {
      params += `fieldName=${searchParams.get("fieldName")}&`;
    }
    if (searchParams.get("sportType")) {
      params += `sportType=${searchParams.get("sportType")}&`;
    }
    if (searchParams.get("province")) {
      params += `province=${searchParams.get("province")}&`;
    }
    if (searchParams.get("district")) {
      params += `district=${searchParams.get("district")}&`;
    }
    if (searchParams.get("minPrice")) {
      params += `minPrice=${searchParams.get("minPrice")}&`;
    }
    if (searchParams.get("maxPrice")) {
      params += `maxPrice=${searchParams.get("maxPrice")}&`;
    }

    return params;
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList className="text-md">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách sân</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-heading font-bold mt-8">Danh sách sân</h2>
      </div>
      <Search
        fieldName={searchParams.get("fieldName") || undefined}
        sportType={searchParams.get("sportType") || undefined}
        province={searchParams.get("province") || undefined}
        district={searchParams.get("district") || undefined}
        minPrice={searchParams.get("minPrice") || undefined}
        maxPrice={searchParams.get("maxPrice") || undefined}
        showFilter={true}
      />
      <CourtList urlSearchParams={urlSearchParams} isHomePage={false} />
      <Footer />
    </div>
  );
}
