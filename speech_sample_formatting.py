"""
input -- a csv file with three columns: number, target, rendition

output --
number. target
[rendition]

"""

import argparse
import csv
import sys

def parse_args(args):
    parser = argparse.ArgumentParser()

    parser.add_argument('input')
    parser.add_argument('output')

    return parser.parse_args(args)


def main(input, output):
    with open(output, 'w') as outfile:
        with open(input, 'r') as csvfile:
            reader = csv.reader(csvfile)
            for num, target, rendition in reader:
                num = num.strip()
                target = target.strip()
                rendition = rendition.strip()
                outfile.write("{}. {}\n".format(num, target))
                outfile.write("[{}]\n".format(rendition))
                outfile.write("\n")


if __name__ == '__main__':
    args = parse_args(sys.argv[1:])
    main(args.input, args.output)
