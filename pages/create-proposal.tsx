import Layout from "@/components/Layout";
import Link from "next/link";
import TransactionList from "@/components/Transactions/TransactionList";
import HTMLTextEditor from "@/components/HTMLTextEditor";
import SubmitButton from "@/components/SubmitButton";
import { Formik, Form, Field } from "formik";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Transaction } from "ethers";
import { title } from "process";
export interface Values {  // <--- Add 'export' here
  title: string;
  summary: string;
  transactions: Transaction[];
}
export default function Create() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="max-w-[650px] w-full">
          <div className="flex items-center">
            <Link
              href="/vote"
              className="flex items-center border border-skin-stroke hover:bg-skin-muted rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon className="h-4" />
            </Link>

            <div className="text-2xl sm:text-4xl font-bold relative font-heading text-skin-base">
              Create your proposal
            </div>
          </div>

          <Formik
            initialValues={{ title: "", transactions: [], summary: "" }}
            onSubmit={() => { }}
          >
            {({ values }) => (
              <Form className="mt-6 flex flex-col w-full">
                <label className="relative text-md font-heading text-skin-base">
                  Proposal title
                </label>

                <Field
                  name="title"
                  type="text"
                  placeholder="My New Proposal"
                  className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-lg w-full text-md mt-2 border-amber-400 border "
                />

                <label className="relative text-md font-heading text-skin-base mt-6">
                  Transactions
                </label>

                <TransactionList values={values} />

                <label className="relative text-md font-heading text-skin-base mt-6">
                  Summary
                </label>

                <HTMLTextEditor />

                <SubmitButton />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
}
