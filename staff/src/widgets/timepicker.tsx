import { Autocomplete, Box, createStyles, Menu, Popover, Select, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { min } from 'lodash';
import { forwardRef, useCallback, useState } from 'react';
import { TimeInput } from '@mantine/dates';
import { SelectPopover } from '@mantine/core/lib/Select/SelectPopover/SelectPopover';
import { SelectItems } from '@mantine/core/lib/Select/SelectItems/SelectItems';


export default function DateTimeTest() {
    return <div>
        <br />
        {/* <TimePicker />
        <br /><br /><br /><br /> */}
        <TimePicker2 />
        <br /><br /><br />
        <Title>heya</Title>
    </div>
}

type SelectableTime = {
    morning: boolean;
    hours: number;
    minutes: number;
    value: string;
    text: string;
}

function FormatSelectableTime(input: Omit<SelectableTime, 'value'>): SelectableTime {
    let { hours, minutes, morning } = input;
    const end = morning ? 'AM' : 'PM';
    if (minutes < 10) minutes = ('0' + minutes) as any;
    return {
        ...input,
        value: [hours, minutes].join(':') + ' ' + end,
    }
}

function SelectableTimeFromDate(date: Date): SelectableTime {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const morning = hours <= 12;
    if (!morning) hours -= 12;
    return FormatSelectableTime({
        hours,
        minutes,
        morning,
        text: [hours, minutes].join(':') + (morning ? 'am' : 'pm'),
    })
}

const potentialTimes: SelectableTime[] = [];
['am', 'pm'].map(ofDay => {
    const morning = ofDay === 'am';
    for (let h = 1; h <= 12; h++) {
        potentialTimes.push(FormatSelectableTime({
            morning,
            hours: h,
            minutes: 0,
            text: h + ofDay,
        }));
        for (let m = 0; m < 60; m += 5) {
            potentialTimes.push(FormatSelectableTime({
                morning,
                hours: h,
                minutes: m,
                text: h + '' + m + ofDay,
            }));
            potentialTimes.push(FormatSelectableTime({
                morning,
                hours: h,
                minutes: m,
                text: h + ':' + m + ofDay,
            }));
        }
    }
});

function renderPotentialTime() {

}

const TimeAutocompleteItem = forwardRef<HTMLDivElement, SelectableTime & { [key: string]: any }>(
    ({ morning, hours, minutes, text, value, key, ...rest }, ref) => (
        <div ref={ref} key={text} {...rest}>
            <Text>{value}</Text>
        </div>
    )
);

function TimePicker() {
    const [using, setUsing] = useState(true);
    const [value, _setValue] = useState<string>();
    const setValue = useCallback(function (input: string) {
        console.log(value);
    }, []);
    return <Autocomplete
        label="Only 2 options at a time"
        placeholder="Your favorite framework"
        limit={2}
        data={potentialTimes}
        itemComponent={TimeAutocompleteItem}
        value={value}
        onChange={(value) => setValue(value)}
        
        filter={(value, item) => {
            // if (value.length === 0) return false;
            // if (!item.text.startsWith(value[0]) || !item.value.startsWith(value[0])) return false;
            // return item.text.toLowerCase().includes(value.toLowerCase().trim()) ||
            // item.value.toLowerCase().includes(value.toLowerCase().trim())
            if (value.length === 0) return false;
            if (item.text.toLowerCase().startsWith(value.toLowerCase().trim())) return true;
            return false;
        }}
    />
}


const styles = createStyles((theme) => ({
    item: {
        ...theme.fn.fontStyles(),
        WebkitTapHighlightColor: 'transparent',
        fontSize: theme.fontSizes.sm,
        border: 0,
        backgroundColor: 'transparent',
        outline: 0,
        width: '100%',
        textAlign: 'left',
        textDecoration: 'none',
        boxSizing: 'border-box',
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        cursor: 'pointer',
        borderRadius: theme.fn.radius(),
        color: theme.colorScheme === 'dark'
            ? theme.colors.dark[0]
            : theme.black,
        display: 'flex',
        alignItems: 'center',

        '&:disabled': {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
            pointerEvents: 'none',
            userSelect: 'none',
        },

        '&[data-hovered]': {
            backgroundColor: theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors.dark[3], 0.35)
                : theme.colors.gray[1],
        },
    },

    itemLabel: {
        flex: 1,
    },

    itemIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.xs,
    },

    itemRightSection: {},
}));

function TimePicker2() {
    const popoverOpened = true;
    const { classes, cx, theme } = styles();
    const [hovered, setHovered] = useState(-1);

    const handleMouseLeave = () => setHovered(-1);
    const handleMouseEnter = (n: number) => setHovered(n);

    const items = ['hi', 'there'];

    return <Popover opened={popoverOpened} position="bottom" width="target" transition="pop">
        <Popover.Target>
            <div>
                <TimeInput />
            </div>
        </Popover.Target>
        <Popover.Dropdown sx={{ padding: 4 }}>
            {items.map((value, i) => {
                return <Box component='button' className={cx(classes.item)} key={value}
                    data-hovered={hovered === i ? true : undefined}
                    onMouseEnter={handleMouseEnter.bind(null, i)}
                    onMouseLeave={() => handleMouseLeave()}>
                    {value}
                </Box>
            })}
        </Popover.Dropdown>
        {/* <DirectiveTest $hi='5' /> */}
    </Popover>
}

// function DirectiveTest(props: { '$hi': string }) {
//     return <div>hmmm</div>
// }