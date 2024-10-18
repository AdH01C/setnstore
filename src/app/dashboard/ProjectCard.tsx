import ApplicationDataService from "@/app/services/NewAppDataService";
import { useRouter } from "next/navigation";
import { Button, Card, Modal, Typography } from "antd";

interface ProjectCardProps {
  appId: string;
  appName: string;
  companyName: string;
  companyId: string;
  onDelete: (appId: string) => void;
}

export default function ProjectCard({
  appId,
  appName,
  // companyName,
  companyId,
  onDelete,
}: ProjectCardProps) {
  // const [currentlySelected, setCurrentlySelected] = useAtom(
  //   currentlySelectedAtom
  // );
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    Modal.confirm({
      title: "Delete Application",
      content: "Are you sure you want to delete this application?",
      onOk: async () => {
        try {
          await ApplicationDataService.deleteApplication(companyId, appId);
          console.log(`Application with ID ${appId} deleted successfully`);
          onDelete(appId);
        } catch (error) {
          console.error("Error deleting application:", error);
        }
      },
    });
  };

  return (
    <Card title={appName} bordered={false} hoverable style={{ width: 300 }}>
      <Typography.Text type="secondary">A sample description</Typography.Text>
      <div className="flex justify-between">
        <Button
          type="primary"
          onClick={() => {
            router.push(`/applications/${appId}`);
          }}
          style={{ marginTop: "1rem" }}
        >
          View
        </Button>
        <Button danger onClick={handleDelete} style={{ marginTop: "1rem" }}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
