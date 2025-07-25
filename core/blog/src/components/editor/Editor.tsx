import EditorForm from './EditorForm';
import { slugService } from '../../services';

async function Editor({ slugId }: { slugId?: string }) {
  const slug = await slugService.getSlugById(+slugId!);

  return <EditorForm slug={slug} />;
}
export default Editor;
