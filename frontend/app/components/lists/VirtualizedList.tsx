import { List, type RowComponentProps, useDynamicRowHeight } from "react-window";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type Item = {
    id: number;
    text: string;
    index: number;
}


type CustomProps = {
    items: Item[];
    index: number;
    style: any;
}

const CustomComponent = ({ items, index, style }: CustomProps) => {
    return (
        <div className="border-slate-700 hover:bg-slate-50 transition-colors border-2 py-4 w-full h-full flex items-center gap-4 px-6" >
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="Jarren Benton" />
                <AvatarFallback>JB</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-medium">Jarren Benton</p>
                <p className="text-sm text-gray-600">{items[index].text}</p>
            </div>
        </div>
    )
}

function Row({
    index,
    style,
    items
}: RowComponentProps<{
    items: Item[];
}>) {
    return (
        <div style={style} className="pb-4 px-4">
            <CustomComponent index={index} style={style} items={items} />
        </div>
    );
}

type VirtualizedListProps = {
    items: Item[];
}

type RowProps = {
  items: Item[];
};

export const VirtualizedList = ({ items }: VirtualizedListProps) => {
    return (
        <List<RowProps>
            rowComponent={Row}
            rowCount={items.length}
            rowHeight={80}
            rowProps={{ items: items }}
        />
    );
};