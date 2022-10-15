import { Box, Button, Container, createStyles, Paper, Text, Title, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications'
import { useCallback, useState } from 'react';
import { api } from '@khe~/api/trpc'
import { TestWidget } from '@khe~/app/widgets/test';
import DateTimeTest from '../widgets/timepicker';


const useStyles = createStyles(theme => ({
    paper: {
        // backgroundColor: theme.colors.background[2]
    }
}))


export default function Homepage() {
    const { classes  } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [count, setCount] = useState(0);
    const notify = () => {
        setCount(count + 1);
        showNotification({
            id: `notify-test-${count}`,
            message: `heya ${count}`,
            title: 'oof',
            color: 'red',
        })
    }
    const ping = api.ping.useQuery();
    const createTicket = api.tickets.create.useMutation().mutate;
    const tickets = api.tickets.list.useQuery();
    return <Container>
        <Title>Staff</Title>
        <Text>woah</Text>
        <Button onClick={() => notify()}>heya</Button>
        <Box>yooo, {ping.data?.toLocaleString()}</Box>
        <Paper className={classes.paper} shadow={'xs'} withBorder>
            hmmm

            <Paper className={classes.paper} shadow={'xs'} withBorder>yeye</Paper>
        </Paper>
        <Box>yeee</Box>
        <Button onClick={() => toggleColorScheme()}>{colorScheme}</Button>
        <br /><br />
        <TestWidget />
        <DateTimeTest />
        <Button onClick={() => {
            createTicket({
                email: 'cseitz5@kent.edu',
                name: 'Chris',
                subject: 'Question',
                message: 'test test test test',
            })
        }}>create ticket</Button>
        <pre>{JSON.stringify(tickets.data, null, ' ')}</pre>
    </Container>
}

// const eey: number = 20;
// eey = 'woah';