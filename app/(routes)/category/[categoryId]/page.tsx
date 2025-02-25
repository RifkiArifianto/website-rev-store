import getCategory from "@/actions/get-category";
import getProducts from "@/actions/get-products";
import Banner from "@/components/banner";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  // Tunggu params untuk di-parse dulu
  const { categoryId } = await params;

  const products = await getProducts({
    categoryId: categoryId,
  });

  const category = await getCategory(categoryId);

  return (
    <div className="bg-white">
      <Container>
        <Banner data={category.banner} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {products.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export async function generateStaticParams(): Promise<
  { categoryId: string }[]
> {
  console.log("ENV URL:", process.env.PUBLIC_API_URL); // Debug di sini

  try {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/categories`);

    if (!res.ok) {
      console.error("Failed to fetch categories:", res.statusText);
      return [];
    }

    const categoriesData = await res.json();

    if (Array.isArray(categoriesData)) {
      return categoriesData.map((category) => ({
        categoryId: category.id,
      }));
    }

    console.error("Unexpected categories data format:", categoriesData);
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default CategoryPage;
