import { id } from "ethers/lib/utils.js";
import { useField } from "formik";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
    loading: () => (
        <div className="mt-2 min-h-[250px] bg-gray-100 rounded-md animate-pulse" />
    ),
});

const HTMLTextEditor = () => {
    const props = { name: "summary", type: "text", id: "summary" };
    const [_, meta, helpers] = useField(props.name);
    const { value } = meta;
    const { setValue } = helpers;

    return (
        <RichTextEditor
            controls={[
                ["bold", "italic", "underline", "link"],
                ["unorderedList", "h1", "h2", "h3"],
            ]}
            className="mt-2 min-h-[250px]"
            value={value}
            onChange={(value) => setValue(value)}
            {...props}
        />
    );
};

export default HTMLTextEditor;
import { type } from "os";
