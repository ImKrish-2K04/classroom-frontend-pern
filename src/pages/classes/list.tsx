import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";

const ClassesList = () => {
  return (
    <CreateView>
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p className="my-auto text-muted-foreground">List of all classes</p>
        <CreateButton />
      </div>
    </CreateView>
  );
};

export default ClassesList;
