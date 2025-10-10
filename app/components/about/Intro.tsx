import { IconContainer } from '~/components/icon-container';
import { Info } from 'lucide-react';


export const AboutIntro = () => {
    return (
        <div className="text-muted-foreground mx-auto space-y-4">
            <IconContainer icon={Info} size="lg" color="handdrawn" className="mb-2" />
            <h2 className="text-2xl font-semibold text-foreground">Legal Knowledge, Made Simple</h2>
            <div className="prose prose-lg space-y-2">
                <p>
                    In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree.
                </p>
                <p>
                    Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you.
                </p>
                <p>
                    While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.
                </p>
            </div>
        </div>
    )
}